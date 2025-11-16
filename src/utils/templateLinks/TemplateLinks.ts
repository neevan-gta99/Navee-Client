const csvTemplateLinks: Record<string, string> = {
  mentopwear: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzQ6OcyHz5Y9bzz2rTJlfMnyFOorcZ_XRTHqFmzqXM3C7yy4rnioNnsxoOFIo6w1e4JWs4-MpHE7vN/pubhtml",
  menbottomwear: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXeQfCD_LqVL3mx5jpUZ-PHkVl0bjds-fI42sT2l8zJBJh39UgjEhclDKCPgWzp-ex_oVHj6x1a4XM/pubhtml",
  menfootwear: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVzGuwELXBZL1ZgIf1rS8Kd5x5Buz9pwGXVzM4pQdtTZlFeHpEGnwrksxlKLZ87itAELvmJ1iJLvP3/pubhtml",
  womensethnic: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfRjhJEYNylHhu7y0IlO0z85sX9wE_yrh9AS9PaV2UFRixbkJt9bKdJARxN77R212XRI3em5YGLclX/pubhtml",
  womenswestern: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ14ov10dkrsbPKJzDAzfcqDr5p6JN3meWAayveBxV8nd46grvnZm9Dw5E_-QjOfmSa_jk7r1OKUAPf/pubhtml",
  womensfootwear: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRUcuXwJGvTefl0wIES9UVzEf0Wo8nvdmavTEkKw0Zpqvn8OVph31_hDmMEq6dSDMPN6wAuM9_WtMKV/pubhtml",
  boysbrands: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTt5trKgJktyl3zyhHDVkfQptbamggPJLa8zxpNILFzRBCwEyzSkhh6tvcLGGeeZr9iwbUYA2IQiAtj/pubhtml",
  girlsgrands: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2fd02A2QdWRghCOI9uwf_oqx6svgIn7DggdqWaaUbCX2z_T2451e21cxmWUbfMesQ8lu-R0OU0ZVM/pubhtml",
  menswatchesandaccessories: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYtAkxLPWP29Ly7kIrpwYJK-AL_wrc67Rcs0cf11AaCr_9YgIp7Qeo3JuWxcXWLJhKdjwqYrz6O0q_/pubhtml",
  womenswatchesandaccessories: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQrifnm7PnqdmDyyRDteDgu5LGcmfFgBKCMjKxh35QDiNF8f8c99sG1rBZIc96uis2Xs5S_-7J2siPa/pubhtml",
  boyboyswatchesandaccessoriesswa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwpRE4O5AtlFB9sPPXBtK--2lvDLRYMihHhdvcAiciSnmawKztlxvd8-_4fqWA6aTpNfyilRP3ozeE/pubhtml",
  girlswatchesandaccessories: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRctjJxliSCltzV9Oj4t2KjaG3Vb09TfueywOvYpKuKI5LZo67FJl-pFMd8b0M4XQUPj_lFhpQOoqNf/pubhtml",
  bags: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjtU55LTJgX794Hvbh9XX4PDfjIE0jGVj5wIaJdWbDvpJs3tvuf97jyjTHFpzejgYet94lShENfbTn/pubhtml",
  suitcases: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTEKEcahRbWgeO8RB03kC5jobKM5a_GR6FkqFPrvXgFRCxZT0Z6WfTL91_HkDwxoaD0qzJU7SmFFTlQ/pubhtml",
  luggages: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU7NYaB-tFV5OqbWcstyW-l2KrF59ENJ1l70HDyxEpJaNS7yef1m5osL3vXOSGj5T-tptUN6i-2vxr/pubhtml",
};

const excelTemplateLinks: Record<string, string> = {
  mentopwear: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1761648059/Men_Topwear_Excel_Template_opggtr.xlsx",
  menbottomwear: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538144/Men_Bottomwear_Template_wn9kvz.xlsx",
  menfootwear: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Men_Footwear_Template_f9sx1n.xlsx",
  womensethnic: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Women_Ethnic_Template_d1gt6k.xlsx",
  womenswestern: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538146/Women_Western_Template_kw7jou.xlsx",
  womensfootwear: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538146/Women_Footwear_Template_vultbo.xlsx",
  boysbrands: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538143/Boys_Brands_Template_w0tru5.xlsx",
  girlsgrands: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Girls_Grands_Template_r1qbav.xlsx",
  menswatchesandaccessories: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Men_s_Watches_Accessories_Template_mr7adn.xlsx",
  womenswatchesandaccessories: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Women_s_Watches_Accessories_Template_lrzdla.xlsx",
  boyswatchesandaccessories: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538144/Boys_Watches_Accessories_Template_a0xejp.xlsx",
  girlswatchesandaccessories: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538144/Girls_Watches_Accessories_Template_xyqgyh.xlsx",
  bags: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538144/Bags_Template_jmigje.xlsx",
  suitcases: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Suitcases_Template_itft6v.xlsx",
  luggages: "https://res.cloudinary.com/de9nsk1zx/raw/upload/v1762538145/Luggages_Template_fv6z1r.xlsx",


  // Add more categories here
};

const templates_Links = {csvTemplateLinks,excelTemplateLinks}

export default templates_Links;
