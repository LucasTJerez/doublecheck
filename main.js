

var selected_product = "";
var pos = [];
var neg = [];
var mix = [];
var neu = [];
var all_reviews = [];

product_list = [];


function getReviews(e) {
  selected_product = e.path[0].innerHTML
  var apigClient = apigClientFactory.newClient();
  var params = {
    'productName': selected_product
  };
  var div = document.getElementById("product_list")
  div.innerHTML = `<h3>Loading review data...</h3>`
  apigClient.searchreviewsGet(params, {}, {}).then(function (result) {
    div.innerHTML = ``;
    data = result.data
    sources = new Map();
    for (let i = 0; i < data.review_contents.length; i++) {
      
      review_content = result.data.review_contents[i]
      src = review_content.source.toUpperCase()
      sources.set(src, true)
      if (review_content.sentiment.Sentiment == "POSITIVE") {
        pos.push(review_content)
      }
      if (review_content.sentiment.Sentiment == "NEGATIVE") {
        neg.push(review_content)
      }
      if (review_content.sentiment.Sentiment == "NEUTRAL") {
        neu.push(review_content)
      }
      if (review_content.sentiment.Sentiment == "MIXED") {
        mix.push(review_content)
      }
    }
    
    // console.log(pos,neg,mix,neu)

    score = (data.pro_count + 0.5*data.mixed_count)/( data.pro_count + data.con_count + data.mixed_count)

    n_stars = parseInt(score*10)
    content = ""
    product = product_list[parseInt(e.target.id)]
    console.log(product)
    content += 
        `<div class="card_left">
        <img src="${product.image[0]}" style="width:100%;padding:20px;""/>
      </div>
        
        <div class="card_right">
          <h3>
            ${product.productName}
          </h3>
        </div>
        <div class="card_right_2">
          <p>
            DoubleCheck's Score: ${n_stars}/10\n
          </p>
          <p>
          number of reviews: ${data.review_contents.length}
          </p>
        </div>
        <div class="card_right_2">
          <p>
            Price: ${product.price}\n
          </p>
          <a href="${product.storefront}"> link to storefront </a>
        </div>

        `
    div.innerHTML += content
    for (let i = 0; i < data.review_contents.length; i++) {
      review_content = result.data.review_contents[i]
      // console.log(review_content.sentiment)
      div.innerHTML += 
      `<li style="list-style: none;">
        <div class="border">
          <div style="padding-left:15px" class="product_image">
          <p> 
            ${review_content.source.toUpperCase()}
          </p>
          <p>
          <a href="${review_content.link}">link to review</a>
          </p>
          </div>
          <div class="product_content">
            <ul class="list_height" style="list-style: none;">
              <li style="list-style: none;">
              <p>
                ${review_content.sentiment.Sentiment}
                </p>
              </li>
              <li style="list-style: none;">
                <p style="height:100px; overflow:scroll;">
                ${review_content.review}
                </p>
              </li>
            <ul>
          </div>
        </div>
      </li>`
    }
    div.innerHTML += `</ul>`
  })

}

function search(e) {
  var apigClient = apigClientFactory.newClient();
  var params = {
    'productName': document.getElementById("input-search").value
  };
  var div = document.getElementById("product_list")
  div.innerHTML = `<h3>Fetching products...</h3>`
  apigClient.searchproductsGet(params, {}, {}).then(function (result) {
   
    
    div.innerHTML = `<ul style="list-style: none" class="main">`;
    // console.log(result.data.length)
    product_list = result.data;
    for (let i = 0; i < result.data.length; i++) {
      product = result.data[i]

      div.innerHTML += 
      `<li style="list-style: none;">
        <div class="border">
          <div class="product_image">
            <img style="width:100%;padding:20px;" src="${product.image[0]}"/>
          </div>
          <div class="product_content">
            <ul style="list-style: none;">
              <li style="list-style: none;">
                <button id="${i}" onclick="getReviews(event, {})">${product.productName}</button>
              </li>
              <li style="list-style: none;">
                <h4>${product.price}</h4>
              </li>
            <ul>
          </div>
        </div>
      </li>`
      // name="${product.price}" value="${product.storefront}
      // console.log(product)
    }
    div.innerHTML += "</ul>"
    
  })

}
