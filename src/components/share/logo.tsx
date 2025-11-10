import logo from "@/resources/images/logo.png";
export default function Logo({ marginBottom = "-100px", marginTop = "-60px", marginRight = "0px" }: { marginBottom?: string, marginTop?: string, marginRight?: string }) {
  return (
    <div className="flex items-center justify-center mb-4">
      <img
        src={logo}
        alt="Logo"
        width={300}
        height={300}
        style={{
          width: "300px",
          height: "300px",
          marginBottom,
          marginTop,
          marginRight,
          objectFit: "contain",
        }}
      />
    </div>
  );
}

