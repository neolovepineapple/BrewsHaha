import React from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Heading, Text, Image, Card, Button, Mask, IconButton} from 'gestalt';
import {Link} from 'react-router-dom';
import {calculatePrices, setCart, getCart} from '../utils'
const apiUrl = process.env.API_URL || 'http://localhost:1337/';

const strapi = new Strapi(apiUrl);


class Brews extends React.Component{
    state  = {
        brews:[],
        brand: '',
        cartItems:[]
    }
    async componentDidMount(){
        try{
            const response = await strapi.request('POST', '/graphql', {
                data: {
                    query: `# Write your query or mutation hereq
    
                    query {
                      brand(id: "${this.props.match.params.brandId}"){
                        _id
                        name
                        
                        brews{
                          _id
                          name
                          description
                          Image{
                            url
                          }
                          price
                        }
                      }
                    }`
                }
            });
            //console.log(response);
            this.setState({
                brews: response.data.brand.brews,
                brand: response.data.brand.name,
                cartItems: getCart()
            });

        }catch(err){
            console.error(err);

        }
        
    }
    
    addToCart = brew=>{
        const alreadyInCart = this.state.cartItems.findIndex(item=> item._id=== brew._id);
        if(alreadyInCart === -1){
            const updatedItems = this.state.cartItems.concat({
                ...brew,
                quantity: 1
            });
            this.setState({cartItems:updatedItems}, ()=>setCart(updatedItems));
        }else{
            const updatedItems = [...this.state.cartItems];
            updatedItems[alreadyInCart].quantity+=1;
            this.setState({cartItems:updatedItems}, ()=>setCart(updatedItems));
        }


    }

    deleteItemFromCart = itemToDeleteId=>{
        const filteredItems = this.state.cartItems.filter(item => item._id!=itemToDeleteId);
        this.setState({cartItems: filteredItems}, ()=>setCart(filteredItems));

    }


    render(){
        const {brews, brand, cartItems} = this.state;
        return(
            <Box
            marginTop={4}
            display="flex"
            justifyContent="center"
            alignItems="start"
            dangerouslySetInlineStyle={{
                __style:{
                    flexWrap: 'wrap-reverse'
                }
            }}
            >
            <Box
            display="flex"
            direction="column"
            alignItems="center"

            >
            <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>

            </Box>
            <Box
            dangerouslySetInlineStyle={{
                __style:{
                    backgroundColor:'#bdcdd9'
                }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}

            >
            {brews.map(brew=>(
                        <Box
                        width={220}
                        margin={2}
                        key={brew._id}
                        >
                        <Card
                        image={
                          <Box height={200} width={200}>
                            <Image 
                            alt="Brand"
                            naturalHeight={1}
                            naturalWidth={1}
                            src={`${apiUrl}${brew.Image.url}`}
                            />
                          </Box>
                        }>
                        <Box
                        display="flex"
                        //alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                        direction="column"
                        
                        >  
                        <Box marginBottom={2}>
                          <Text size="xl">{brew.name}</Text>
                          </Box>
                          <Text>{brew.description}</Text>
                          <Text color="orchid">${brew.price}</Text>
 
                          <Box marginTop={2}>
                          <Text size="xl">
                            <Button 
                            onClick={()=>this.addToCart(brew)}
                            color="blue" text="Add to Cart"/>
                          </Text>
                          </Box>
                        </Box>
                          
                        </Card>
            
                        </Box>
            
            )
                
            )}

            </Box>

            </Box>

                        {/* user cart */}
            <Box alignSelf="end" marginTop={2} marginLeft={8}>
                <Mask shape="rounded" wash> 
                        <Box
                        display="flex"
                        direction="column"
                        alignItems="center"
                        padding={2}
                        >
                        <Heading  size="sm" align="center" size="md">Your Cart</Heading>
                        <Text color="gray" italic>
                        {cartItems.length} items selected
                        </Text>

                        {cartItems.map(item=>(
                            <Box key={item._id} display="flex"
                            alignItems="center">
                            <Text>
                                {item.name} x {item.quantity} - {(item.quantity * item.price).toFixed(2)}
                            </Text>
                            <IconButton
                            accessibilityLabel="Delete Item"
                            icon="cancel"
                            size="sm"
                            iconColor="red"
                            onClick={()=>this.deleteItemFromCart(item._id)}

                            />
                            </Box>
                        ))}




                        <Box display="flex" alignItems="center" 
                        justifyContent="center" direction="column">
                        <Box margin={2}>
                        {cartItems.length===0 && (
                            <Text color="red">Please select some items
                            </Text>
                        )}
                    
                        </Box>
                        <Text size="lg">total: {calculatePrices(cartItems)}</Text>
                        <Text>
                            <Link to="/checkout">Checkout</Link>
                        </Text>
                        </Box>

                        </Box>
                </Mask>
            </Box>




            </Box>
        )
    }
}

export default Brews;