import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "demo";


  
  // Get the base URL from the request
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;
  
  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    const page = await browser.newPage();
    
    // Set viewport to A4 size
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2, // Higher quality
    });
    
    // Navigate to the CV template page
    const templateUrl = `${baseUrl}/cv-template/${id}`;
    console.log("Navigating to:", templateUrl);
    
    await page.goto(templateUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    
    // Wait for cv-container to appear (it's now on all states including loading)
    await page.waitForSelector("#cv-container", { timeout: 15000 });
    
    // Wait for actual content to load (check for a non-loading state)
    // Give React time to hydrate and fetch data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    
    await browser.close();
    
    // Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CV-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
