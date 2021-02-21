exports.querys = {
  createTemtens: `
   merge (t:Temtem { 
      n: $n,
      name: $name,
      type_one: $type_one,
      type_two: $type_two,
      hp: $hp,
      sta: $sta,
      spd: $spd,
      atk: $atk,
      def: $def,
      spatk: $spatk,
      spdef: $spdef,
      total: $total
      }) 
    return collect( {temtem: t} )
    `,
  getTemtem: `
      match(t:Temtem) return collect(t{.*})
    `,
};