# url-shortener
A simple implementation of a popular system design interview question

## Design
![image](https://user-images.githubusercontent.com/506983/147329301-5020415d-4485-4b33-905c-ec1a1bb2cc49.png)

## Development

### Configure the runtime variables
Copy the `.env.example` to `.env`, and update the contents:
```shell
BASE_URL="http://localhost:3000"
APP_PORT=3000
REDIS_PORT=<RedisPORT>
REDIS_PASSWORD=<RedisPassword>
REDIS_HOSTS="<RedisClusterIPs>"
```
### Running the application
```shell
npm install
npm start
```

## APIs 

### Create an URL
This endpoint accepts `POST`, with a payload, with the following parameters:
- `url`: <string required> the original url to be shortened, length must not exceed 1024 characters including the protocols, currently only support HTTP and HTTPS
- `expiredIn`: <boolean optional> the expiration day of the URL, default is `90` days.

Example

`POST /url/shorten`
```
{
  'url': 'https://github.com/maximmai/url-shortener/edit/main/README.md'
}
```
Response:
```
200
{
  'url': 'https://fastdns.io/CKRM639'
}
```

### Retrieve an URL
This endpoint accepts a shortened URL, and responds with the original URL, with a HTTP header rewrite to redirect.
  
Example

`GET <shortened_url>`

Response:
```
200 None
```
