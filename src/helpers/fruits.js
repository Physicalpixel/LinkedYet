const ICONS = [
	"1f9cb", // Bubble tea
	"1f426", // Bird
	"1f33a", // Hibiscus
	"1f34c", // Banana
	"1f355", // Pizza
	"1f33b", // Sunflower
	"1fad0", // Blueberry
	"1f985", // Eagle
	"1f337", // Tulip
	"1f35c", // Ramen
	"1f951", // Avocado
	"1f338", // Cherry blossom
	"1f54a", // Dove
	"1f369", // Donut
	"1f339", // Rose
	"1f347", // Grape
	"1f9c6", // Falafel
	"1f33c", // Blossom
	"1f34a", // Orange
	"1f427", // Penguin
	"1f940", // Wilted flower
	"1f378", // Cocktail
	"1f95f", // Dumpling
	"1fab7", // Lotus
	"1f350", // Pear
	"1f353", // Strawberry
	"1f986", // Duck
	"1f33e", // Sheaf of rice
	"1f9c7", // Waffle
	"1f35d", // Spaghetti
	"1f34e", // Apple
	"1f37a", // Beer
	"1f989", // Owl
	"1f352", // Cherry
	"1f33f", // Herb
	"1f364", // Shrimp
	"1f96f", // Bagel
	"1f35b", // Curry
	"1f490", // Bouquet
	"1f965", // Coconut
	"1f373", // Egg
	"1f96d", // Mango
	"1f9a9", // Flamingo
	"1f354", // Burger
	"1f36b", // Chocolate
	"1f331", // Seedling
	"1f95e", // Pancakes
	"1f34d", // Pineapple
	"1f980", // Crab
	"1f375", // Tea
	"1f424", // Baby chick
	"1f363", // Sushi
	"1f332", // Evergreen tree
	"1f96a", // Sandwich
	"1f370", // Cake
	"1f349", // Watermelon
	"1f953", // Bacon
	"1f9a2", // Swan
	"1f9c3", // Juice
	"1f35a", // Rice
	"1f32e", // Taco
	"1f333", // Deciduous tree
	"1f366", // Soft ice cream
	"1f95d", // Kiwi
	"1f377", // Wine
	"1f9a4", // Dodo
	"1f371", // Bento
	"1f36a", // Cookie
	"1f334", // Palm tree
	"1f351", // Peach
	"1f99e", // Lobster
	"2615", // Coffee
	"1f372", // Fried rice
	"1f99c", // Parrot
	"1f32f", // Burrito
	"1f9c1", // Cupcake
	"1f34b", // Lemon
	"1f357", // Chicken
	"1f964", // Smoothie
	"1f35f", // Fries
	"1f36d", // Lollipop
	"1f968", // Pretzel
	"1f969", // Steak
	"1f95b", // Milk
	"1f32d", // Hotdog
	"1f36f", // Honey
	"1f35e", // Bread
	"1f368", // Ice cream
	"1f37f", // Popcorn
	"1f950", // Croissant
	"1f36c", // Candy
	"1f33d", // Ear of corn
	"1fab8", // Hyacinth
	"1f341", // Maple leaf
	"1f342", // Fallen leaf
	"1f343", // Leaf fluttering
]
export function fruitImageUrl(key) {
	console.log(key)
	const cp = ICONS[key] || "1f34e"
	return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${cp}.png`
}
