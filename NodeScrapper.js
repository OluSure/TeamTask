const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const articles = [
    {
        name: 'pure',
        address: 'https://abdn.pure.elsevier.com/en/publications',
        base: ''
    },
    {
        name: 'biomed',
        address: 'https://reproductive-health-journal.biomedcentral.com/articles/',
        base: ''
    },
    {
        name: 'rg',
        address: 'https://www.researchgate.net/directory/publications',
        base: '',
    },
    {
        name: 'cj',
        address: 'https://www.contraceptionjournal.org/inpress',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'tnt',
        address: 'https://www.tandfonline.com/topic/allsubjects/hs',
        base: '',
    },
    {
        name: 'fertstert',
        address: 'https://www.fertstert.org/inpress',
        base: '',
    },
    {
        name: 'doaj',
        address: 'https://doaj.org/search/journals',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'plos',
        address: 'https://journals.plos.org/globalpublichealth/',
        base: '',
    },
    {
        name: 'sciencedirect',
        address: 'https://www.sciencedirect.com/journal/women-and-birth',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'sagepub',
        address: 'https://journals.sagepub.com/sociology-gender-cultural-studies',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'who',
        address: 'https://www.who.int/publications/journals',
        base: ''
    },
    {
        name: 'aas',
        address: 'https://aasopenresearch.org/browse/articles',
        base: ''
    },
    {
        name: 'unfpa',
        address: 'https://www.unfpa.org/latest',
        base: ''
    }
]

const materials = []

articles.forEach(article => {
    axios.get(article.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Contraceptives")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                materials.push({
                    title,
                    url: article.base + url,
                    source: article.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Materials for Contraceptives')
})

app.get('/posts', (req, res) => {
    res.json(materials)
})

app.get('/posts/:articleId', (req, res) => {
    const articleId = req.params.articleId

    const articleAddress = articles.filter(article => article.name == articleId)[0].address
    const articleBase = articles.filter(article => article.name == articleId)[0].base


    axios.get(articleAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificmaterials = []

            $('a:contains("Contraceptive")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificmaterials.push({
                    title,
                    url: articleBase + url,
                    source: articleId
                })
            })
            res.json(specificmaterials)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
