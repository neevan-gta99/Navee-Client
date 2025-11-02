const categoryGenderMap: { [key: string]: string } ={
  MenTopwear: "Male",
  MenBottomwear: "Male",
  MenFootwear: "Male",
  WomenEthnic: "Female",
  WomenWestern: "Female",
  WomenFootwear: "Female",
  BoysBrands: "Male",
  GirlsGrands: "Female",
  MensWatchesandAccessories: "Male",
  WomensWatchesandAccessories: "Female",
  BoysWatchesandAccessories: "Male",
  GirlsWatchesandAccessories: "Female",
};

const miniCategoryMap: { [key: string]: string } ={

  MensWatchesandAccessories: "Mens WA",
  WomensWatchesandAccessories: "Womens WA",
  BoysWatchesandAccessories: "Boys WA",
  GirlsWatchesandAccessories: "Girls WA",


}

const filter_Maps = { categoryGenderMap, miniCategoryMap };
export default filter_Maps;