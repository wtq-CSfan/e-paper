let port = null;

document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        document.getElementById('status').textContent = '✅ 已连接 Pico';
        document.getElementById('todoSection').style.display = 'block';
        document.getElementById('connectBtn').style.display = 'none';
    } catch (e) {
        document.getElementById('status').textContent = '❌ 连接失败，请重试';
    }
});

document.getElementById('sendBtn').addEventListener('click', async () => {
    if (!port) {
        alert('请先连接 Pico');
        return;
    }

    const inputs = document.querySelectorAll('.todo-input');
    const todos = [];

    for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim();
        if (val) {
            todos.push(`${i + 1}.${val}`);
        }
    }

    if (todos.length === 0) {
        alert('请至少输入一条待办');
        return;
    }

    const text = todos.join('|') + '\n';
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(text));
    writer.releaseLock();

    document.getElementById('result').textContent = '✅ 已推送到墨水屏！';
    setTimeout(() => {
        document.getElementById('result').textContent = '';
    }, 2000);
});