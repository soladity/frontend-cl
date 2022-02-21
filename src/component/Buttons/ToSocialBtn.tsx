import * as React from "react";
import ButtonUnstyled, {
  ButtonUnstyledProps,
  buttonUnstyledClasses,
} from "@mui/base/ButtonUnstyled";
import { styled, Theme } from "@mui/system";
import {
  FaDiscord,
  FaTwitter,
  FaTelegram,
  FaYoutube,
  FaMedium,
  FaEarlybirds,
  FaDrupal,
} from "react-icons/fa";

const ButtonRoot = React.forwardRef(function ButtonRoot(
  props: React.PropsWithChildren<{}>,
  ref: React.ForwardedRef<any>
) {
  const { children, ...other } = props;

  return (
    <svg width="150" height="100" {...other} ref={ref}>
      <polygon points="0,100 0,0 150,0 150,100" className="bg" />
      <polygon points="0,100 0,0 150,0 150,100" className="borderEffect" />
      <foreignObject x="0" y="0" width="150" height="100">
        <div className="content">{children}</div>
      </foreignObject>
    </svg>
  );
});

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  800: "#004C99",
  900: "#623313",
};

const CustomButtonRoot = styled(ButtonRoot)(
  ({ theme }: { theme: Theme }) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${theme.palette.mode === "light" ? blue[600] : blue[100]};
  --hover-color: ${theme.palette.mode === "light" ? blue[50] : blue[900]};
  --active-color: ${theme.palette.mode === "light" ? blue[100] : blue[800]};

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 1;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: 150 600;
    stroke-dashoffset: 150;
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    .borderEffect {
      stroke-dashoffset: -600;
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: 2px solid ${theme.palette.mode === "dark" ? blue[900] : blue[200]};
    outline-offset: 2px;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      font-size: 0.875rem;
      font-family: IBM Plex Sans, sans-serif;
      font-weight: 500;
      line-height: 1.5;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`
);

const SvgButton = React.forwardRef(function SvgButton(
  props: ButtonUnstyledProps,
  ref: React.ForwardedRef<any>
) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

const Type = (type: any) => {
  switch (type) {
    case "Discord":
      return <FaDiscord />;
    case "Twitter":
      return <FaTwitter />;
    case "Telegram":
      return <FaTelegram />;
    case "Youtube":
      return <FaYoutube />;
    case "Medium":
      return <FaMedium />;
    default:
      break;
  }
};

export default function UnstyledButtonCustom(props: any) {
  return (
    <a href={props.linkUrl} target="_blank">
      <SvgButton style={{ margin: 10 }}>
        <div style={{ color: "#caa959" }}>
          <div style={{ textAlign: "center", fontSize: 32 }}>
            {Type(props.type)}
          </div>
          <div style={{ textAlign: "center" }}>{props.type}</div>
        </div>
      </SvgButton>
    </a>
  );
}
