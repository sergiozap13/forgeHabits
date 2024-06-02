export async function isValidJWT(request) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    console.log(token)
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('https://forge-habits.vercel.app/api/auth/status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if(response.ok){
            const data = await response.json()
            return data.isLoggedIn
        }
    } catch (error) {
        console.error('Error al verificar el /status: ', error);
    }

    return false
}