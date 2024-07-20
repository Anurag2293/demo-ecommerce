
import Search from "./Search";
import Cart from "./Cart";
import LeftArrow from "./LeftArrow";
import RightArrow from "./RightArrow";
import CheckedInterest from "./CheckedInterest";
import UnCheckedInterest from "./UnCheckedInterest";
import Spinner from "./Spinner";

interface IconProps {
    name: "search" | "cart" | "left-arrow" | "right-arrow" | "checked-interest" | "unchecked-interest" | "spinner",
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
        case "checked-interest":
            return <CheckedInterest />
        case "unchecked-interest":
            return <UnCheckedInterest />
        case "spinner":
            return <Spinner /> 
        default:
            return null; // Or throw an error
    }
};

export default Icon;