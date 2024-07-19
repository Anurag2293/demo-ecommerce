
import Search from "./Search";
import Cart from "./Cart";
import LeftArrow from "./LeftArrow";
import RightArrow from "./RightArrow";

interface IconProps {
    name: "search" | "cart" | "left-arrow" | "right-arrow"
}

const Icon: React.FC<IconProps> = ({ name }) => {
    switch (name) {
        case "search":
            return <Search />;
        case "cart":
            return <Cart />;
        case "left-arrow":
            return <LeftArrow />
        case "right-arrow":
            return <RightArrow />
        default:
            return null; // Or throw an error
    }
};

export default Icon;