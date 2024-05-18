// File finder - client side JS code

let template = document.getElementById('results-template').innerHTML
let renderTemplate = Handlebars.compile(template)

document.getElementById('search-button').onclick = function(){
    let file_name = document.getElementById('file-name').value
    if (!file_name) {return 0}
    fetch('/search', {
        method: 'POST',
        body: JSON.stringify({search: file_name}),
        headers: {"Content-Type": 'application/json'}
    }).then((response)=>{
        response.json().then(files=>{
            document.getElementById('results').innerHTML = renderTemplate({files: files})
        })
    })
}