import logo from "@/resources/images/logo.png";
export default function Logo() {
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
          marginBottom: "-100px",
          marginTop: "-60px",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

