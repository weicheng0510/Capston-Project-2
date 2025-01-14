import React from 'react'
import CategoryList from '../components/CategoryList';
import BrandList from '../components/BrandList';
import PicksForYou from '../components/PicksForYou';

const Home = () => {
    return (
        <div>
            <BrandList />
            <CategoryList />
            <PicksForYou />
        </div>
    )
}

export default Home;