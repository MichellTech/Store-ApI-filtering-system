const product = require("../models/products")

const getAllProductsStatic =  async (req,res)=>{
    const products =  await product.find({company : "ikea"})
    res.status(200).json({products: products})
}

const getAllProducts =  async (req,res)=>{
    const {featured,company,name,sort,fields,page,limit,numericFilters} = req.query
    const queryObject = {}
    if(featured){
        queryObject.featured =  featured === "true" ?  true : false
    }
    if(company){
        queryObject.company === company
    }
    if (name){
        // find the name that involve the passed name and make it case insensitive
        queryObject.name = {$regex : name , $options: "i"}
    }
    // filtering for range greater or equal etc
    if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
          }
        });
      }
    // without sorting
    // const products = await product.find(queryObject).sort("name price")

    // with sorting
    let result =  product.find(queryObject)
if(sort){
    const sortList = sort.split(",").join(" ")
    // console.log(sortList)
    result = result.sort(sortList)
}
else{
    result = result.sort("createdAt") 
}

// return only specific paramaters
if (fields){
    const fieldList =  fields.split(",").join(" ")
    result = result.select(fieldList)
}

// pagination

const selectedpage = Number(page) || 1
const selectedlimit = Number(limit) || 5
const skip  = (selectedpage - 1) * selectedlimit
result.skip(skip).limit(selectedlimit)
const products = await result
    res.status(200).json({nbHits:products.length,products: products})
}

module.exports = {getAllProducts,getAllProductsStatic}