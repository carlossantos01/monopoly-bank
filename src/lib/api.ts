export async function createRoom(id: string) {
    return await fetch("/api/room/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
        }),
    });

}