export const getProductById = `
select id, title, description, price, img_url, count from product
left join stock s on product.id = s.product_id
where id = $1
`
