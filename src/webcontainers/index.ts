import { files } from '@/webcontainers/files';
import { WebContainer } from '@webcontainer/api';

const installDependencies = async (webcontainerInstance: WebContainer) => {
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk);
    }
  }));
  return installProcess.exit
}

const startDevServer = async (webcontainerInstance: WebContainer) => {
  await webcontainerInstance.spawn('npm', ['run', 'start']);

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

export const runWebContainer = () => {
  /** @type {import('@webcontainer/api').WebContainer}  */

  window.addEventListener('load', async () => {
    const textareaEl = document.querySelector('textarea');
    if (textareaEl == null) {
      console.error('textareaEl is null');
      return
    }
    textareaEl.value = files['index.js'].file.contents;
    // Call only once
    const webcontainerInstance = await WebContainer.boot();
    await webcontainerInstance.mount(files);
    const exitCode = await installDependencies(webcontainerInstance);
    if (exitCode !== 0) {
      console.error('Failed to install dependencies');
      return
    }

    startDevServer(webcontainerInstance)
  });
}
