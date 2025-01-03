const BASE_URL = process.env.NEXT_PUBLIC_URL;

export async function createRoom(id: string) {
    return await fetch(`${BASE_URL}/api/room/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
        }),
    });

}

export async function getRoom(roomId: string) {
    const url = `${BASE_URL}/api/room/get?roomId=${roomId}`;
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Erro ao buscar a sala");
    }
    return await response.json();
}

export async function createPlayer(username: string, roomId: string) {
    return await fetch(`${BASE_URL}/api/player/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            roomId,
        }),
    });
}

export async function getPlayer(playerId: string) {
    const url = `${BASE_URL}/api/player/get?playerId=${playerId}`;
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Erro ao buscar o usuário");
    }
    return await response.json();
}

export async function getPlayers(roomId: string) {
    const url = `${BASE_URL}/api/player/get/all?roomId=${roomId}`;
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Erro ao buscar jogador(es)");
    }
    return await response.json();
}

export async function pay(roomId: string, playerId: string, receiverId: string, amount: number, description: string) {
    return await fetch(`${BASE_URL}/api/transaction/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            roomId,
            senderId: playerId,
            receiverId,
            amount,
            description,
        }),
    });
}

export async function getTransactions(playerId: string) {
    const url = `${BASE_URL}/api/transaction/get?playerId=${playerId}`;
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
        throw new Error("Erro ao buscar transações");
    }
    return await response.json();
}