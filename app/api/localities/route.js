import { NextResponse } from "next/server";
import { searchBySuburb, searchByPostcode } from "../../../lib/localities";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const q = searchParams.get("q") || "";

  let results = [];
  if (type === "suburb") {
    results = searchBySuburb(q);
  } else if (type === "postcode") {
    results = searchByPostcode(q);
  } else {
    return NextResponse.json(
      { message: "type must be 'suburb' or 'postcode'." },
      { status: 400 }
    );
  }

  return NextResponse.json({ results });
}
