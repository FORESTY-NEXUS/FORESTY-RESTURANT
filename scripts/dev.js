const { spawn } = require('child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const processes = [
  spawn(npmCommand, ['run', 'dev:next'], { shell: true, stdio: 'inherit' }),
  spawn(npmCommand, ['run', 'dev:server'], { shell: true, stdio: 'inherit' }),
];

let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const childProcess of processes) {
    if (!childProcess.killed) {
      childProcess.kill();
    }
  }

  process.exit(exitCode);
};

for (const childProcess of processes) {
  childProcess.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      shutdown(code || 1);
    }
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
