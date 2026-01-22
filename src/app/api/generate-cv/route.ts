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
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    
    // Wait for images to load
    await page.waitForSelector("#cv-container", { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Extra wait for images
    
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
