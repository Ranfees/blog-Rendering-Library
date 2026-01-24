const body = document.body;
body.style.backgroundColor = "#f0f2f5"; 
body.style.margin = "0"; 

const canvas = document.createElement('div');

Object.assign(canvas.style, {
    // Layout & Positioning
    width: "90%",           
    maxWidth: "800px",            
    height: "auto",               
    margin: "40px auto",          
    
    // Visual Styling (The "Card" Look)
    backgroundColor: "#ffffff",
    border: "1px solid #e1e4e8",  
    borderRadius: "12px",        
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
    
    // Typography & Spacing
    padding: "40px",            
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#333",                
    lineHeight: "1.6",            
    boxSizing: "border-box"       
});

body.append(canvas);

const now = new Date();
const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

async function generateBlog(slug) {
  const response = await fetch(`https://blogify-three-weld.vercel.app/api/viewblog/${slug}`);
  const data = await response.json();
  console.log(data)
    canvas.append(renderBlogPost(data.blog))
}

function bold(b){
    let boldText = document.createElement('b')
    boldText.append(b)
    return (boldText)
}

function italics(i){
    let italicText = document.createElement('i')
    italicText.append(i)
    return (italicText)
}

function underline(u){
    let underlineText = document.createElement('u')
    underlineText.append(u)
    return (underlineText)
}

function code(s){
    let span = document.createElement('span')
    span.style.fontFamily = 'monospace'
    span.style.color = '#ff6666'
    span.style.backgroundColor = '#ededed'
    span.style.borderRadius = '3px'
    span.style.padding = '3px'
    span.append(s)
    return (span)
}

function bulletNumber(a){
    let ol = document.createElement('ol')
    a.forEach((i)=>{
        let li = document.createElement('li')
        li.append(i)
        ol.append(li)
    })
    return (ol)
}

function renderBlogPost(blog){

    // EACH BLOG WILL BE INSIDE AN ARTICLE
    let article = document.createElement('article')
    Object.assign(article.style,{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
    color: "#333",             
    lineHeight: "1.6",            
    boxSizing: "border-box"
    })

    //  TITLE IS FROM JSON
    let title = document.createElement('h1')
    title.innerText = blog.title
    title.style.textAlign = 'left'
    title.style.color = '#3f3f3f'
    article.append(title)
    console.log(blog.createdAt)

    // CREATED DATE AND TIME GENERATION
    const dateOfCreation = new Date(blog.createdAt);
    const dateString = dateOfCreation.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); 
    const timeString = dateOfCreation.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit',});

    let publlishedOn = document.createElement('h5')
    publlishedOn.style.color = '#90abb5'
    publlishedOn.style.fontWeight = '200'
    publlishedOn.append("Published on ",dateString," • ",timeString)

    article.append(publlishedOn)
    article.append(document.createElement('hr'))

    //  ALIGNMENT SECTION TYPE[HEADING OR PARAGRAPH] FUNCTION CALLING
    blog.content.forEach((element)=>{
        article.append(sectionSetup(element))
    })
    return article
}   

function sectionSetup(element){
    let tag

    //  SWITCH FOR CREATING CUSTOM TAG
    switch (element.type){
        case "heading-one":{
            tag = document.createElement('h1')
            break;
        }
        case "heading-two":{
            tag = document.createElement('h2')
            break;
        }
        case "paragraph":{
            tag = document.createElement('p')
            // tag.style.marginBottom = '100px'     //  ADD THIS LINE ONLY IN FURTHER CSS STYLING
            break;
        }
        case "numbered-list":{
            tag = document.createElement('ol')
            break;
        }
        case "bulleted-list":{
            tag = document.createElement('ul')
            break;
        }
        default:{
            tag = document.createElement('div')
            break;
        }
    }

    //  SWITCH FOR ALIGNING CUSTOM CREATED TAG
    switch(element.align){
        case "right":{
            tag.style.textAlign = 'right'
            break;
        }
        case "center":{
            tag.style.textAlign = 'center'
            break;
        }
        case "justify":{
            tag.style.textAlign = 'justify'
            break;
        }
        default:{
            tag.style.textAlign = 'left'
            break;
        }
    }
    if(!(tag.tagName == 'OL' || tag.tagName == "UL")){
            element.children.forEach((child)=>{
            tag.append(createText(child))
        })
    }
    if(tag.tagName == 'OL' || tag.tagName == "UL"){
            element.children.forEach((listItem)=>{
                tag.append(createList(listItem))
            })
    }

    return tag

}

function createText(child){
    let text = child.text

    /*  CREATE CONDITION FOR EMPTY STRING   */

    if(child.bold){
        text = bold(text)
    }
    if(child.italic){
        text = italics(text)
    }
    if(child.underline){
        text = underline(text)
    }
    if(child.code){
        text = code(text)
    }
    return text
}

function createList(listItem){
    let li = document.createElement('li')

    listItem.children.forEach((item)=>{
        li.append(createText(item))
    })

    return li    
}