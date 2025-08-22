document.getElementById("botao").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Por favor, insira um e-mail.");
        return;
    }

    try {
        const response = await fetch("/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = "index2.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Erro ao se inscrever.");
    }
});

document.getElementById("descadastrar").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Por favor, insira o e-mail para descadastrar.");
        return;
    }

    try {
        const response = await fetch("/unsubscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        alert("Erro ao descadastrar.");
    }
});

