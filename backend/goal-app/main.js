async function main() {
    console.log('Hello, World!');

    const { default: activeWin } = await import('active-win');
    for (let i = 0; i < 10; i++) {
        try {
            const window = await activeWin();
            if (window) {
            // window.owner.name に 'Code.exe' や 'chrome.exe' などが入る
            console.log('Active App:', window.owner.name);
            }
        } catch (error) {
            console.error(error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    process.exit(0);
}

main();