/* eslint-disable no-undef */
import * as chai from 'chai'
const expect = chai.expect

describe('Prueba del endpoint principal /habits', () => {
  it('status code = 200', async () => {
    const response = await fetch('http://localhost:3000/api/habits')
    expect(response.status).to.equal(200)
  })
})
