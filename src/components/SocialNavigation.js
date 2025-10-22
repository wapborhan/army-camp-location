import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaCodepen,
  FaFacebookSquare,
} from "react-icons/fa";

export default function SocialNavigation() {
  return (
    <div className="adminActions">
      <input type="checkbox" name="adminToggle" className="adminToggle" />
      <div className="adminButton">
        <img src="wb-logo.png" alt="" />
      </div>
      <div className="adminButtons">
        <Link href="https://www.facebook.com/wapborhan">
          <i>
            <FaFacebookSquare />
          </i>
        </Link>
        <Link href="https://github.com/wapborhan">
          <i>
            <FaGithub />
          </i>
        </Link>
        <Link href="https://www.linkedin.com/in/wapborhan/">
          <i>
            <FaLinkedin />
          </i>
        </Link>
        <Link href="https://codepen.io/wapborhan">
          <i>
            <FaCodepen />
          </i>
        </Link>
      </div>
    </div>
  );
}
