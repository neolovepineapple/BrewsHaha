import React, { Component } from 'react';
import './App.css';
import {Container, Box, Heading, Card, Image, Text, SearchField, Icon, Spinner} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Link} from 'react-router-dom';const apiUrl = process.env.API_URL || 'http://localhost:1337/';
const strapi = new Strapi(apiUrl);


class App extends Component {
  state={
    brands: [],
    searchTerm: '',
    loadingbrands: true
  }



  async componentDidMount(){
    try{
      const response = await strapi.request('POST','/graphql', {
        data:{
          query:`
          query {
    
            brands{
               _id
              name
              description
              Image{
                url
              }
              
              
          }
          }
          `
      }
      });
      //console.log(response);
      this.setState({brands: response.data.brands, loadingbrands: false})

    }catch(err){
      console.err(err);
      this.setState({loadingbrands:false})
    }

    

  }

  handleChange = ({value})=>{
    this.setState({searchTerm:value});
  }
  render() {
    const {brands, searchTerm, loadingbrands} = this.state;
    return (
      <Container>
        {/*  Search Field Component*/}
        <Box display="flex" justifyContent="center" marginTop={4}>
        <SearchField 
        id="searchField"
        accessibilityLabel="Brands Search Field"
        onChange={this.handleChange}
        placeholder="Search Brands"
        />
        <Box margin={2}>
          <Icon 
          icon="filter"
          color={searchTerm?'orange':'gray'}
          size={20}
          accessibilityLabel="Filter"
          />
        </Box>
        </Box>

        
        <Box 
        display="flex"
        justifyContent="center"
        marginBottom={2}
        >
        <Heading color="midnight" size="md">
        Brew Brands

        </Heading>
        </Box>
        <Box 
        display="flex"
        justifyContent="around">
          {brands.map(brand=>(
            <Box
            width={200}
            margin={2}
            key={brand._id}
            >
            <Card
            image={
              <Box height={200} width={200}>
                <Image 
                alt="Brand"
                naturalHeight={1}
                naturalWidth={1}
                src={`${apiUrl}${brand.Image.url}`}
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
              <Text size="xl">{brand.name}</Text>
              <Text>{brand.description}</Text>
              <Text size="xl">
                <Link to={`/${brand._id}`}>
                See Brews
                </Link>
              </Text>
            </Box>
              
            </Card>

            </Box>

          ))}
        </Box>
        <Spinner show={loadingbrands}
        accessibilityLabel="Loading Spinner"/>
      </Container>
    );
  }
}

export default App;
