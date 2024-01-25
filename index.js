const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const url2 = 'https://es.wikipedia.org';
const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res)=>{
    try{
        const html = await axios.get(url)
        if (html.status === 200){
            const $ = cheerio.load(html.data)
            const pageData = []
            const links = []
                $('#mw-pages a').each((index, element)=>{
                    const link = $(element).attr('href')
                    links.push(link);
                })
            const newlinks = links.map(element => url2 + element ) // añadimos la primera parte a los enlaces
            newlinks.forEach( async link =>{    
                const html2 = await axios.get(link)
                if(html2.status === 200){
                    const $ = cheerio.load(html2.data)
                    const h1 = $('h1').text();
                    const img =$('img').attr('src');
                    const arrayP=[];
                    $('p').each((index, element)=>{
                        const pText = $(element).text();
                        arrayP.push(pText);                        
                    })
                    const pageObjet ={
                        h1: h1,
                        img: img,
                        p: arrayP
                    }
                    pageData.push(pageObjet)
                    if(pageData.length === newlinks.length){
                        res.send(pageData)
                    }                    
                 }                           
            })//newlinks.forEach        
        }
    }catch(error){
        console.log('error de petición', error)
    }   
})

app.listen(3000, ()=>{
    console.log('express listening on http://localhost:3000');
})

