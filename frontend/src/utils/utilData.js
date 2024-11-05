import business from "../assets/business.png";
import sports from "../assets/sports.png";
import lifestyle from "../assets/lifstyle.png";
import technology from "../assets/technology.png";
export const categories = [
    {
        name:"Business",
        desc:"Insights for Thriving in Today's Business World",
        icon:business
    },
    {
        name:"Sports",
        desc:"Highlights, Training, and Insights from the World of Sports",
        icon:sports
    },
    {
        name:"Technology",
        desc:"The Latest Breakthroughs and Trends in Technology",
        icon:technology
    },
    {
        name:"Lifestyle",
        desc:"Tips and Trends for a Healthier, Happier Lifestyle",
        icon:lifestyle
    }
]



export const next = (stateUpdater,index,array, startPosition) => {
    startPosition.current = 200;
   index < array.length -1 ? stateUpdater( index + 1 ) : stateUpdater(0);
}
export const prev = (stateUpdater,index,array, startPosition) => {
    startPosition.current = -200;
    index == 0 ? stateUpdater( array.length -1 ) : stateUpdater( index - 1 );
 }
