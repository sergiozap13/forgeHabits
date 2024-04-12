export async function isValidJWT(request) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    console.log(token)
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/status', {
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