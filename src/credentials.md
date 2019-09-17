## Padrão de arquivo
### credentials.json

```json
{
	"prod": {
		"baseURL": "http://localhost:3000",
		"authURL": "http://localhost:3000/signin",
		"classroomURL": "/classroom", 
		"pdfURL": "/pdf",
		"validateTokenURL": "/validateToken"
	}
}
```

- baseURL - URL base para a aplicação 
- authURL - URL completa para o login
- classroomURL - Complemento que leva a URL de salas
- pdfURL - Complemento que leva a URL de geração e obtenção de PDF's
- validateTokenURL - Complemento que leva a URL responsável por validar o Token JWT
