# talent-acquisition-report-fn

Generate candidate assessment report and create zip file together with resume and attachment if any

## Handlers Expression Tips

1. Use triple {{{ variable_with_special_char_html }}}, https://handlebarsjs.com/guide/expressions.html#html-escaping
2. Use @root , {{@root.variable}} to change context within #each or #with else you data will be ignored, https://handlebarsjs.com/api-reference/data-variables.html#root

## To deploy to AWS

1. Run `yarn install`
2. Run the following command:

```bash
TAG_VERSION=local-$(date -u +%Y%m%d-%H%M%S) yarn sls deploy --stage {{ ENVIRONMENT }} --region {{ REGION }}
```

For Window Powershell:

```shell
$Env:TAG_VERSION="0."+$(Get-Date -UFormat +%Y%m%d.%H%M%S)
yarn sls deploy --stage {{ ENVIRONMENT }} --region {{ REGION }}
```

**Note**: Replace `{{ ENVIRONMENT }}` and `{{ REGION }}` with the environment and region that you are intended to deploy
