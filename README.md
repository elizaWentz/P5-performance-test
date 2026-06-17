<h1>P5 performance analyse</h1>

<h2>Probleem</h2>
<p>
  De combinatie van de carrousel en de ingeladen P5-sketches in de grid daaronder is te zwaar voor de performance. 
  De pagina laadt langzaam en hapert.
</p>

<img width="1501" height="auto" alt="Screenshot 2026-06-05 at 11 18 00" src="https://github.com/user-attachments/assets/72f56a25-4a2a-4ded-8195-6aa82729b318" />

<p>De zwaarte ligt vooral bij de P5-grid, niet bij de carrousel. Wanneer je de carrousel weghaalt, wordt de performance zelfs slechter. 
  Dit komt doordat de carrousel de grid naar beneden duwt, waardoor er minder P5-sketches tegelijk worden ingeladen. 
  Er moet dus een manier worden gevonden om de P5-grid lichter te maken.
</p>

<h2>Uitgeteste mogelijkheden</h2>

<h3>1. Click-preview</h3>
<p>Bij deze oplossing moet je eerst klikken op de P5-sketch die je wilt bekijken voordat deze zichtbaar wordt. 
  Hierdoor hoeft de sketch pas ingeladen te worden wanneer erom gevraagd wordt. Dit is niet ideaal, omdat je op de RIT-website natuurlijk alle P5-sketches in één keer wilt kunnen zien.
</p>

<h3>2. Static preview image</h3>
<p>
  Laad een screenshot van de p5 in, dus is geen echte live p5. 
</p>

<img width="299" height="auto" alt="Screenshot 2026-06-05 at 15 13 42" src="https://github.com/user-attachments/assets/b0b958f9-e4cc-475a-ad71-ea36b1a29bb1" />


<h3>3. scale perimeter voor grid sketches</h3>
<p>Bij deze oplossing wordt de canvasgrootte aangepast aan het formaat waarin de sketch wordt ingeladen. 
  Dit kan in de P5-sketch zelf worden gedaan. Het probleem hiermee is dat de sketch mogelijk te klein wordt 
  wanneer je deze als banner wilt gebruiken op een detailpagina. 
</p>

<p>of</p>

<p>grid-preview kleiner renderen door een scale-parameter mee te geven aan de iframe-url. 
  In viewer.html kan deze parameter gebruikt worden om de canvas kleiner te maken voor sketches die in de grid geladen worden.
</p>

 
<img width="384" height="auto" alt="Screenshot 2026-06-05 at 15 24 31" src="https://github.com/user-attachments/assets/9a854114-b561-44ef-9d6d-0748bd933627" />

<img width="579" height="auto" alt="Screenshot 2026-06-05 at 15 20 56" src="https://github.com/user-attachments/assets/dfce8c7a-8eed-4e04-874e-a939d0e94382" />


<h4>Nadeel:</h4>
<p>
  Dit werkt alleen goed voor sketches die draw() gebruiken. Voor sketches die alleen binnen setup() tekenen, 
  moet de schaling direct na createCanvas() plaatsvinden.  Hierdoor worden sommige P5 al gauw niet goed ingeladen. 
  Hiervoor moeten we alle p5 checken/aanpassen voor de juiste structuur.
 </p>
<p>
  Ik heb dit uitgeprobeerd. De performance ging hierbij van 63 naar 99. Dit is dus wel een goede optie. Alleen werden veel P5-sketches ingezoomd ingeladen, of juist kleiner dan het frame weergegeven. 
</p>
<img width="1503" height="auto" alt="Screenshot 2026-06-05 at 15 33 58" src="https://github.com/user-attachments/assets/ba40e144-7f37-497d-a4a8-b2f39deb1a20" />


<h3>4. P5 sketches lazy loaden in de grid</h3>

<p>De grid-items worden direct aangemaakt, maar de iframe zelf wordt nog niet meteen aangemaakt. In plaats daarvan wordt de sketch-url opgeslagen in dataset.src.</p>

<p>Met IntersectionObserver wordt gekeken wanneer een grid-item bijna in beeld komt. Zodra dat gebeurt, wordt de iframe aangemaakt en krijgt deze de echte src. Pas dan wordt de p5 sketch geladen. </p>

<p>Hierdoor worden niet alle p5 sketches tegelijk gestart, maar alleen de sketches die bijna zichtbaar zijn. De caroussel bovenaan laadt wel meteen één actieve sketch.</p>



<h4>Extra optimalisatie:</h4>
<p>
  De previews in de grid starten niet direct bij het openen van de pagina, maar pas nadat de gebruiker scrolt. Hierdoor blijft de eerste page load lichter.
</p>
<img width="401" height="auto" alt="image" src="https://github.com/user-attachments/assets/ded5d206-1412-440e-9b70-5d8e3a39e7eb" />


<p>
  Om te voorkomen dat de eerste rij zwart blijft, worden een paar lichte sketches bovenaan de lijst gezet en direct geladen. 
  Zware sketches staan later in de grid, zodat ze niet meteen invloed hebben op de eerste performance-meting.
</p>

<p>Ook wordt het aantal actieve grid-previews beperkt. Als er te veel live p5 iframes geladen zijn, wordt een oudere iframe weer verwijderd.</p>

<img width="242" height="auto" alt="image" src="https://github.com/user-attachments/assets/e87c9a5f-5f80-48a3-8b9e-4f4a8579df10" />

<p>Met deze combinatie blijft de performance rond 100, ook met veel meer sketches in de grid.</p>

<h4>Nadeel:</h4>
<p>Je ziet dat de p5 geladen wordt als je naar beneden scrolt. </p>

<img width="1505" height="auto" alt="Screenshot 2026-06-11 at 15 10 40" src="https://github.com/user-attachments/assets/284d4b39-7aaf-4a04-9e59-c577b4cc6946" />

<h2>Conclusie</h2>
<p>De scale parameter voor de P5-sketches geeft de beste performance, maar is met de tijd die we hebben waarschijnlijk niet haalbaar. We moeten dan namelijk elke P5-sketch apart controleren en aanpassen. Ook is er een kans dat sommige sketches daarna niet goed worden ingeladen of verkeerd worden weergegeven.
Daarom denk ik dat het lazy loaden van de P5-sketches in de grid de beste optie is. De performance wordt hiermee een stuk beter, zonder dat we alle sketches hoeven aan te passen. Met de extra preview-mode voor de zwaarste sketches blijft de performance ook goed wanneer er meer P5-sketches worden ingeladen.
Het enige nadeel is dat je soms ziet dat een sketch nog wordt geladen wanneer je naar beneden scrollt. Toch vind ik dit de beste oplossing, omdat deze makkelijk toe te passen is en de performance goed blijft.
</p>
