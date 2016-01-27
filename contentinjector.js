// Get the page DOM and scrape it for 'paymentsy' stuff
var balance = "";
var mondo = $('<img>');
mondo.attr('src', safari.extension.baseURI + 'Icon.png');
mondo.attr('height', '12px');
mondo.attr('width', '12px');
var EURGBP = 0.756743;

$(document).ready(function()
{
  var link = document.createElement("link");
  link.href = safari.extension.baseURI + 'tooltipster.css';
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);

  if (window === window.top)
  {
    safari.self.addEventListener( "message", function( e ) {
    if( e.name === "getBalance" ) {

    balanceMsg = e.message;
    balance = balanceMsg;
    if (balance !== "") enhancePricesSterling();
    if (balance !== "") enhancePricesEuro();
      //enhancePricesEuro();
  }

}, false );

safari.self.tab.dispatchMessage( "getBalance" );
setInterval(function(){ safari.self.tab.dispatchMessage( "getBalance" ); }, 5000);

}
});

///////////////////////////////////////////////////////////////////////////////
// £££££ STERLING £££££
///////////////////////////////////////////////////////////////////////////////

function enhancePricesSterling()
{
  $('.mondoprice_sterling').remove();

  //var pricefields = $("[class*=price],[class*=Price],[class*=amount],[class*=Amount],[class*=cost],[class*=Cost]");
  var pricefields = $('span,td,a').filter(function() {
          text = $(this).text();
          text = text.replace(" ", "");
          text = text.replace(",","");

          return /^£\d+(.\d+)?/.test(text);
      });

  $.each(pricefields, function(index, value)
  {
    var thisfield = $(pricefields.eq(index));
    b = floatifySterling(balance);
    enhanceFieldSterling(thisfield, b);
  });

}

function enhanceFieldSterling(thisfield, b)
{
  //enhanceField(thisfield.first(), b);
  var space = $('<span class="mondoprice_sterling">&nbsp;</span>');
  var oktopay = $('<img class="mondoprice_sterling">');
  oktopay.attr('src', safari.extension.baseURI + 'okay.png');
  oktopay.attr('height', '8px');
  oktopay.attr('width', '8px');

  var noktopay = $('<img class="mondoprice_sterling">');
  noktopay.attr('src', safari.extension.baseURI + 'noway.png');
  noktopay.attr('height', '8px');
  noktopay.attr('width', '8px');

  var price = thisfield.text();
  if (isApriceSterling(price))
  {
    p = floatifySterling(price);

    if (b >= p)
    {
      var diff = b - p;
      difftag = $("<span>&nbsp;You'll have £" + diff.toFixed(2) + " remaining</span>");
      thisfield.append(space).after(oktopay);
      oktopay.tooltipster({content: difftag.prepend(mondo)});
    }
    if (b < p)
    {
      var diff = p - b;
      difftag = $("<span>&nbsp;You're £" + diff.toFixed(2) + " short</span>");
      thisfield.append(space).after(noktopay);
      noktopay.tooltipster({content: difftag.prepend(mondo)});
    }
  }
}

function isApriceSterling(price)
{
  price = price.replace(" ","");
  price = price.replace(",","");
  return /^£\d+(.\d+)?/.test(price)
}

function floatifySterling(price)
{
  //Turn £10.00 into a float 10.00
  price = price.replace("£", "");
  price = price.replace(" ", "");
  price = price.replace(",", "");
  f = parseFloat(price);
  return f;

}

///////////////////////////////////////////////////////////////////////////////
// €€€€€ EUROs €€€€€
///////////////////////////////////////////////////////////////////////////////

function enhancePricesEuro()
{
  $('.mondoprice_euro').remove();

  //var pricefields = $("[class*=price],[class*=Price],[class*=amount],[class*=Amount],[class*=cost],[class*=Cost]");
  var pricefields = $('span,td,a').filter(function() {
          text = $(this).text();
          text = text.replace(" ", "");
          text = text.replace(",","");

          return /(^€|€$)/.test(text);
      });

  $.each(pricefields, function(index, value)
  {
    var thisfield = $(pricefields.eq(index));
    b = floatifySterling(balance);
    enhanceFieldEuro(thisfield, b);
  });

}

function enhanceFieldEuro(thisfield, b)
{
  //enhanceField(thisfield.first(), b);
  var space = $('<span class="mondoprice_euro">&nbsp;</span>');
  var oktopay = $('<img class="mondoprice_euro">');
  oktopay.attr('src', safari.extension.baseURI + 'okay.png');
  oktopay.attr('height', '8px');
  oktopay.attr('width', '8px');

  var noktopay = $('<img class="mondoprice_euro">');
  noktopay.attr('src', safari.extension.baseURI + 'noway.png');
  noktopay.attr('height', '8px');
  noktopay.attr('width', '8px');

  var price = thisfield.text();
  if (isApriceEuro(price))
  {
    p = floatifyEuro(price);
    var inSterling = p * EURGBP;
    if (b >= inSterling)
    {


      var diff = b - inSterling;
      //difftag = $("<span>&nbsp;You'll have £" + diff.toFixed(2) + " remaining</span>");
      difftag = $("<span>&nbsp;That's £" + inSterling.toFixed(2) + " in GBP - You'll have £" + diff.toFixed(2) + " remaining</span>");
      thisfield.append(space).after(oktopay);
      oktopay.tooltipster({content: difftag.prepend(mondo)});
    }
    if (b < inSterling)
    {
      var diff = inSterling - b;
      difftag = $("<span>&nbsp;That's £" + inSterling.toFixed(2) +  " in GBP - You're £" + diff.toFixed(2) + " short</span>");
      thisfield.append(space).after(noktopay);
      noktopay.tooltipster({content: difftag.prepend(mondo)});
    }
  }
}

function isApriceEuro(price)
{
  price = price.replace(" ","");
  price = price.replace(",","");
  return /(^€|€$)/.test(price)
}

function floatifyEuro(price)
{
  //Turn €10.00 into a float 10.00
  price = price.replace("€", "");
  price = price.replace(" ", "");
  price = price.replace(",", "");
  price = price.replace("'", "");

  f = parseFloat(price);

  return f;
}
