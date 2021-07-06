export const getProducts = `
select id, title, description, price, img_url, count from product
left join stock s on product.id = s.product_id
`