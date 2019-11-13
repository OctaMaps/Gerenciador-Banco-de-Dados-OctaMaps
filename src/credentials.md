## Padrão de arquivo

### credentials.json

```json
{
	"prod": {
		"baseURL": "http://localhost:3000",
		"authURL": "http://localhost:3000/signin",
		"classroomURL": "/classroom",
		"pdfURL": "/pdf",
		"validateTokenURL": "/validateToken",
		"userURL": "/user"
	}
}
```

- baseURL - URL base para a aplicação
- authURL - URL completa para o login
- classroomURL - Complemento que leva a URL de salas
- pdfURL - Complemento que leva a URL de geração e obtenção de PDF's
- userURL - Complemento referente a operações relacionadas a tabela de Usuários
- validateTokenURL - Complemento que leva a URL responsável por validar o Token JWT
