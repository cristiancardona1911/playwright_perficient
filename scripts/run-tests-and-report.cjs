const { spawnSync } = require('node:child_process');

const playwrightCli = require.resolve('@playwright/test/cli');
const testResult = spawnSync(process.execPath, [playwrightCli, 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
});
const reportResult = spawnSync(process.execPath, [playwrightCli, 'show-report', 'reports/html'], {
  stdio: 'inherit',
});

process.exitCode = testResult.status ?? 1;
if (process.exitCode === 0 && reportResult.status !== 0) {
  process.exitCode = reportResult.status ?? 1;
}
