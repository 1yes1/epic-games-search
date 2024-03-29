// var stringSimilarity = require("string-similarity");

let SortBy;
let SortDir;
let Categories;
let params;

async function findGameWithName(req,isComingSoon) {

  const getParams = req.params;
  const query = req.query;

  // return query.searchWords;
  setAppProperties();
  // return (query.hasOwnProperty("country")) ;

  var searchWords = "";
  if(query.hasOwnProperty("searchWords")) 
  {
    searchWords = query.searchWords;
    searchWords = searchWords.replace("®", "");
  }

  var country = "US";
  if(query.hasOwnProperty("country")) 
  {
    country = query.country.toUpperCase();
  }

  var locale = "us";
  if(query.hasOwnProperty("locale")) 
  {
    locale = query.locale.toLowerCase();
  }

  var categories = "Games";
  if(query.hasOwnProperty("categories"))
  {
    categories = query.categories;
  } 

  params["comingSoon"] = isComingSoon;
  params["categories"] = Categories[categories];
  params["searchWords"] = encodeURIComponent(searchWords);
  params["locale"] = locale;//Dil
  params["country"] = country;//Fiyat
  params["count"] = 40;

  const hashes = ["7d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437"];
  const index = Math.floor(Math.random() * hashes.length);

  return fetch("https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22US%22,%22category%22:%22"+params["categories"]+"%22,%22comingSoon%22:"+params["comingSoon"]+",%22count%22:"+params["count"]+",%22country%22:%22"+params["country"]+"%22,%22keywords%22:%22"+params["searchWords"]+"%22,%22locale%22:%22"+params["locale"]+"%22,%22sortBy%22:%22"+params["sortBy"]+"%22,%22sortDir%22:%22"+params["sortDir"]+"%22,%22start%22:"+params["start"]+",%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%22"+hashes[index]+"%22%7D%7D", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "x-requested-with": "XMLHttpRequest",
      'content-type' : 'application/json; charset=utf-8',
    },
    "referrerPolicy": "no-referrer-when-downgrade",
  })
      .then((response) => response.json())
      .then(function(response) {

        if (response == null || response["data"]["Catalog"]["searchStore"] === null) {
          return (noResultReturn(searchWords, "0"));
        }

        const elements = response["data"]["Catalog"]["searchStore"]["elements"];

        if (elements.length == 0) {
          return (noResultReturn(searchWords, "1"));
        }

        for (let index = 0; index < elements.length; index++) {

          const element = elements[index];

          //Bu yoksa sayfa silinmiş veya değiştirilmiş olabilir o yüzden array den siliyoruz 
          if(element["catalogNs"]["mappings"] === null){
            delete elements[index];
            continue;
          }

          const epicAppUrl = "https://store.epicgames.com/en-US/p/"+element["catalogNs"]["mappings"][0]["pageSlug"];
          element["url"] = epicAppUrl;

          let publisherName = "null";
          for (let index = 0; index < element["customAttributes"].length; index++) {
            const key = element["customAttributes"][index]["key"];

            if (key == "publisherName") {
              publisherName = element["customAttributes"][index]["value"];
            }
          }
          if (publisherName == "null") {
            publisherName = element["publisherDisplayName"];
          }

          element["publisherName"] = publisherName;

          delete element["productSlug"];
          delete element["urlSlug"];
          delete element["seller"];
          delete element["items"];
          delete element["tags"];
          delete element["customAttributes"];
          delete element["catalogNs"];
          delete element["offerMappings"];
          delete element["developerDisplayName"];
          delete element["publisherDisplayName"];
        }
        return (elements);
      });
}



function similarity(str1,str2){
var similarity = stringSimilarity.compareTwoStrings(str1, str2);
// console.log("Similarity: "+similarity+ " ------------ "+ str1+" -- VS -- "+str2);

if(similarity >= 0.625)
{
    return true;
}
else{
    return false;
}
}


function noResultReturn(searchWords,errorIndex){

var status = "";

if(errorIndex == 0)
    status = "Something went wrong! Please Try Again.";
else
    status = "No games found";

let result = {
    "error-index":errorIndex,
    "status":status,
    "searchValue":searchWords,
    // "steamAppId":steamAppId,
}
// dataArray.push(result);
// console.log(JSON.stringify(dataArray));

return result;
}


function setAppProperties(){

SortBy = {
    RelaseDate:"releaseDate",
    ComingSoon:"comingSoon",
    Title:"title",
    Relevancy:"relevancy",
    CurrentPrice:"currentPrice"
}

SortDir = {
    ASC:"ASC",
    DESC:"DESC"
}

Categories = {
    Games:"games/edition/base|",
    GameBundle:"bundles/games|",
    GameEdition:"games/edition|",
    GameAddOn:"addons|",
    Editor:"editors|",
    GameDemo:"games/demo|",
    Apps:"software/edition/base|",
}

Categories = Object.assign(Categories, {
    All:Categories.Games+Categories.GameBundle+Categories.GameEdition+Categories.GameAddOn+Categories.Editor+Categories.GameDemo+Categories.Apps
})

params = {
    "operationName":"searchStoreQuery",
    "searchWords":"",
    "categories":Categories.All,
    "start":0,
    "count":40,
    "sortBy":SortBy.Relevancy,
    "sortDir":SortDir.DESC,
    "comingSoon":false,
    "locale":"en",
    "country":"US",
};

}


module.exports ={
    findGameWithName,setAppProperties
}

