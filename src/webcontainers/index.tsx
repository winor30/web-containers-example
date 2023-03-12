import { files } from '@/webcontainers/files';
import { WebContainer } from '@webcontainer/api';
import 'xterm/css/xterm.css';


let webcontainerInstance: WebContainer

const installDependencies = async () => {
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk);
    }
  }));
  return installProcess.exit
}

const startDevServer = async (terminal: any) => {
  const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'start']);

  serverProcess.output.pipeTo(new WritableStream({
    write(chunk) {
      terminal.write(chunk);
    }
  }));

  webcontainerInstance.on('server-ready', (port, url) => {
    const iframeEl = document.querySelector('iframe');
    if (iframeEl == null) {
      console.error('iframeEl is null');
      return
    }

    console.log('server-ready', port, url)
    iframeEl.src = url
  })
}


export const writeIndexJS = async (content: string) => {
  await webcontainerInstance.fs.writeFile('/index.js', content);
}

export const runWebContainer = async () => {
  /** @type {import('@webcontainer/api').WebContainer}  */

  const textareaEl = document.querySelector('textarea');
  if (textareaEl == null) {
    console.error('textareaEl is null');
    return
  }
  textareaEl.value = files['index.js'].file.contents;

  const terminalEl = document.querySelector<HTMLElement>('#terminal')
  if (terminalEl == null) {
    console.error('terminalEl is null');
    return
  }

  // https://stackoverflow.com/questions/66096260/why-am-i-getting-referenceerror-self-is-not-defined-when-i-import-a-client-side
  const { Terminal } = await import('xterm');
  const terminal = new Terminal( { convertEol: true })
  terminal.open(terminalEl);

  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    console.error('Failed to install dependencies');
    return
  }

  startDevServer(terminalEl)
}
