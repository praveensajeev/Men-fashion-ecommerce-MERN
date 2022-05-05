var db=require('../confiq/connection')
var collection=require('../confiq/collection');
var bcrypt=require('bcrypt');
var objectId=require('mongodb').ObjectId

var promise=require('promise');
const async = require('hbs/lib/async');
const { resolve, reject } = require('promise');
const { response } = require('express');
const userHepers = require('./user-helpers');
module.exports={
    addproduct:(product,callback)=>{
        // console.log(product);
        db.get().collection('product').insertOne(product).then(async (data)=>{
           
           let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
           console.log(products);
    

           for(i=0;i<products.length;i++){
            let OP =  parseInt( products[i].orginalPrice)
            let OfP =  parseInt( products[i].offerpercentage)
       

            var offerPrice= OP-(OP*(OfP/100)).toFixed(0)
             var ids = products[i]._id
              

           }
            //  console.log(offerprice);
                                  
            db.get().collection(collection.PRODUCT_COLLECTION).findOneAndUpdate({_id:objectId(ids)},{$set:{"offerPrice":offerPrice}})
            // console.log(data);
         callback(data.insertedId)
        })

    },
    getAllproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            // let OP = db.get().collection(collection.PRODUCT_COLLECTION).find({$convert:{ input: "", to: "int" }}).project({orginalPrice:1, _id:0}).toArray()
            // let OFP = await db.get().collection(collection.PRODUCT_COLLECTION).find({}).project({offerPrice:1, _id:0}).toArray()
            // let offer = {$convert:{ input: "OP", to: "int" }}

            // console.log(OP);
            // console.log(offer);
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
 getAllcategory:()=>{
 return new promise(async(resolve,reject)=>{
     let category=await db.get().collection(collection.PRODUCT_CATEGORY).find().toArray()
     resolve(category)
 })
 },


     deleteProduct:(proid)=>{
        return new promise((resolve,reject)=>{
            console.log(objectId(proid))
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proid)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getAllproductsDetails:(proid)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proid)}).then((product)=>{
         resolve(product)
            })
        })
        },


        updateProduct:(proid,prodetails)=>{
    console.log(prodetails);
            return new promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proid)},{$set:{
                    brand:prodetails.brand,
                    description:prodetails.description,
                    category:prodetails.category,
                    orginalPrice:prodetails. orginalPrice,
                    offerPrice:prodetails.offerPrice,
                    offerpercentage:prodetails.  offerpercentage
            
                }
            }).then((response)=>{
                resolve(response)
            })
                
            })
        
    },

    addcategory:(category)=>{
       
        return new promise((resolve,reject)=>{
            db.get().collection('category').insertOne(category).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },

    deleteCategory:(cateId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_CATEGORY).deleteOne({_id:objectId(cateId)}).then((response)=>{
                console.log(response);
                resolve(response)

            })
        })
    },
    getAllcategoryDetails:(cateId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_CATEGORY).findOne({_id:objectId(cateId)}).then((category)=>{
                resolve(category)
            })
        })
    },
    updateCategory:(catId,catDetails)=>{
        console.log(catId);
        console.log(catDetails);
     return new promise((resolve,reject)=>{
         db.get().collection(collection.PRODUCT_CATEGORY).updateOne({_id:objectId(catId)},{$set:{
             brand:catDetails.brand,
             category:catDetails.category
         }
        })
         .then((response)=>{
             console.log(response);
             resolve(response)
        
        })
     })
    },
    getAllUsers:()=>{
        return new promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    blockUsers:(id)=>{
        console.log(id);
        return new promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{$set:{
                 userBlock:true
            }}).then((data)=>{
                resolve(data)
            })
        })
    },
    unblockUser:(id)=>{
        return new promise((resolve,reject)=>{
            db. get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{$set:{
                userBlock:false

            }}).then((data)=>{
                resolve(data)
            })
        })

    },
    deleteUsers:(id)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getAllOrders:()=>{
        return new Promise(async (res,rej)=>{
            let orders= await db.get().collection(collection.ORDER_COLLECTION).find().sort({Date:-1}).toArray()
            console.log(orders);
            res(orders)
        })
    },
    getOrderProductDetails:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
               
            ]).toArray()
           
           
            resolve(orderItems)
        })
    },


    statusUpdate:(status,orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                  status:status,

                  
                 
                
                }
            }).then((response)=>{
                resolve(true)
            })
        })
    }   
    
}