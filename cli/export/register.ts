import type { Command } from "commander"
import { exportSnippet } from "lib/shared/export-snippet"
import type { ExportFormat } from "lib/shared/export-snippet"
import { ALLOWED_EXPORT_FORMATS } from "lib/shared/export-snippet"
import { OUTPUT_EXTENSIONS } from "lib/shared/export-snippet"
import { generateCircuitJson } from "lib/shared/generate-circuit-json"
import { getSpiceWithPaddedSim } from "lib/shared/get-spice-with-sim"
import { runSimulation } from "lib/eecircuit-engine/run-simulation"
import { resultToCsv } from "lib/shared/result-to-csv"
import path from "node:path"
import { promises as fs } from "node:fs"
import type { PlatformConfig } from "@tscircuit/props"
import { loadRuntimeProjectConfig } from "lib/project-config"
import { mergePlatformConfigs } from "lib/shared/platform-config-utils"
import { getPlatformConfigWithCliDefaults } from "lib/shared/get-platform-config-with-cli-defaults"

export const registerExport = (program: Command) => {
  program
    .command("export")
    .description("Export tscircuit code to various formats")
    .argument("<file>", "Path to the package file")
    .option(
      "-f, --format <format>",
      `Output format (${ALLOWED_EXPORT_FORMATS.join(", ")})`,
    )
    .option("-o, --output <path>", "Output file path")
    .option("--disable-parts-engine", "Disable the parts engine")
    .option("--show-courtyards", "Show courtyard outlines in PCB SVG output")
    .action(
      async (
        file,
        options: {
          format?: string
          output?: string
          disablePartsEngine?: boolean
          showCourtyards?: boolean
        },
      ) => {
        const formatOption = options.format ?? "json"
        const projectConfig = await loadRuntimeProjectConfig(process.cwd())

        const commandPlatformConfig: PlatformConfig | undefined =
          options.disablePartsEngine === true
            ? { partsEngineDisabled: true }
            : undefined
        const platformConfig = mergePlatformConfigs(
          projectConfig?.platformConfig,
          commandPlatformConfig,
        )

        if (formatOption === "spice") {
          const { circuitJson } = await generateCircuitJson({
            filePath: file,
            platformConfig: getPlatformConfigWithCliDefaults(platformConfig),
          })
          if (circuitJson) {
            const spiceString = getSpiceWithPaddedSim(circuitJson as any)

            const outputSpicePath =
              options.output ??
              path.join(
                path.dirname(file),
                `${path.basename(file, path.extname(file))}.spice.cir`,
              )

            await fs.writeFile(outputSpicePath, spiceString)

            const { result } = await runSimulation(spiceString)

            const csvContent = resultToCsv(result)

            const outputCsvPath = outputSpicePath.replace(
              /\.spice\.cir$/,
              ".csv",
            )

            await fs.writeFile(outputCsvPath, csvContent)
            console.log(
              `Exported to ${outputSpicePath} and ${outputCsvPath} (simulation results)!`,
            )
          }
          process.exit(0)
        }

        // PATCH(homesodamachine): accept a comma-separated list of formats and
        // export each one in a single invocation. Stock only exports one format
        // per call; we generate the circuit JSON once, write it to a temp file,
        // then run exportSnippet against that temp file for each requested
        // format so the (expensive) eval only happens once.
        const formats = formatOption.split(",").map((s) => s.trim())
        if (formats.length === 1) {
          await exportSnippet({
            filePath: file,
            format: formats[0] as ExportFormat,
            outputPath: options.output,
            platformConfig,
            pcbSnapshotSettings: options.showCourtyards
              ? { showCourtyards: true }
              : undefined,
            onExit: (code) => process.exit(code),
            onError: (message) => console.error(message),
            onSuccess: ({ outputDestination }) =>
              console.log(`Exported to ${outputDestination}!`),
          })
        } else {
          const cj = await generateCircuitJson({
            filePath: file,
            platformConfig,
          })
          if (!cj || !cj.circuitJson) {
            console.error("Error generating circuit JSON")
            process.exit(1)
          }
          const projectDir = path.dirname(file)
          const baseName = path.basename(file, path.extname(file))
          const tmpFile = path.join(
            projectDir,
            `._tsci-multifmt-${baseName}.circuit.json`,
          )
          await fs.writeFile(tmpFile, JSON.stringify(cj.circuitJson))
          for (let k = 0; k < formats.length; k++) {
            const fmt = formats[k] as ExportFormat
            const ext = OUTPUT_EXTENSIONS[fmt] || ""
            const out =
              k === 0 && options.output
                ? options.output
                : path.join(projectDir, `${baseName}${ext}`)
            await exportSnippet({
              filePath: tmpFile,
              format: fmt,
              outputPath: out,
              platformConfig,
              pcbSnapshotSettings: options.showCourtyards
                ? { showCourtyards: true }
                : undefined,
              onExit: (code) => {
                if (code !== 0) process.exit(code)
              },
              onError: (message) => console.error(message),
              onSuccess: ({ outputDestination }) =>
                console.log(`Exported to ${outputDestination}!`),
            })
          }
          fs.unlink(tmpFile).catch(() => {})
          process.exit(0)
        }
      },
    )
}
