class SpotifyUtils {
  token = ''
  expiresAt = 0

  private async query(url: string, id: string, secret: string) {
    const token = await this.getToken(id, secret)

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.json()
  }

  private async getToken(id: string, secret: string) {
    if (this.expiresAt > Date.now()) {
      return this.token
    }

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const data = await res.json()

    this.token = data.access_token
    this.expiresAt = Date.now() + data.expires_in * 1000

    return this.token
  }

  async getById(id: string, spotifyId: string, secret: string) {
    return await this.query(`https://api.spotify.com/v1/tracks/${id}`, spotifyId, secret)
  }

  async getArtistById(id: string, spotifyId: string, secret: string) {
    return await this.query(`https://api.spotify.com/v1/artists/${id}`, spotifyId, secret)
  }

  async getAlbumById(id: string, spotifyId: string, secret: string) {
    return await this.query(`https://api.spotify.com/v1/albums/${id}`, spotifyId, secret)
  }
}

export default new SpotifyUtils()
