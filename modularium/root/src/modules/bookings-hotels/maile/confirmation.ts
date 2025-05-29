import { CreateReservation } from '@/src/modules/bookings-hotels/models.js';

// const polskiBoolean = (b?: boolean | null) => (b ? 'tak' : 'nie');

const twojeDane = (params: CreateReservation & { price: number } & { reservationId: string }) => `
Termin przyjazdu: ${params.from.split('T')[0]}

${params.firstName} ${params.lastName}
Adres: ${params.address}
Email: ${params.email}
Nr tel: ${params.phone}
Liczba gości: ${params.guests}
Cena: ${params.price} zł
Numer id rezerwacji: ${params.reservationId}
`;

export const CONFIRMATION_MAIL = (params: CreateReservation & { price: number } & { reservationId: string }) => `
Dziękujemy za rezerwację naszego domku!
 
 
 
Twoja rezerwacja:
 
${twojeDane(params)}

Całkowity koszt państwa rezerwacji to ${params.price} zł.
 
Potwierdzenie rezerwacji:
 
Proszę potwierdzić swoją rezerwację, dokonując płatności zadatku w wysokości 50% ceny całego pobytu. Reszta opłaty będzie do uiszczenia gotówką w dniu przyjazdu (z góry).
 
Dane do przelewu:


W tytule proszę wpisać: "rezerwacja domku"

 
Na wpłatę zadatku czekamy 72 godziny od złożenia zamówienia, jeżeli do tego czasu nie otrzymamy wpłaty rezerwacja zostaje anulowana.

Brak wpłaty pozostałej kwoty skutkuje rezygnacją z zawartej umowy, a wpłacony zadatek nie podlega zwrotowi.


Warunki zameldowania:
 
Doba hotelowa zaczyna się od godziny 14:00, a kończy o godzinie 10:00. 
Do tego czasu należy opuścić domek.
 
Zameldowanie po godzinie 15:00 wiąże się z dodatkową opłatą.
 
Należy powiadomić nas mailowo lub telefonicznie o planowanej godzinie przyjazdu, będziemy czekać na miejscu w celu przekazania kluczy.
 
Sprawdź czy wszystko się zgadza - w razie wątpliwości prosimy o telefon: 507 507 935.
 
`;
export const NOTIFICATION_MAIL = (params: CreateReservation & { price: number } & { reservationId: string }) => `
Nowa rezerwacja!
${params.firstName} ${params.lastName} - rezerwacja od ${params.from} do ${params.to}
Dane klienta:
${twojeDane(params)}
Uwagi: ${params.message}
`;

export const HTML_CONFIRMATION_MAIL = (params: CreateReservation & { price: number } & { reservationId: string }) => `
    <html><body>
<p>Dziękujemy za rezerwację naszego domku!</p>
<br/> 
<br/>  
<br/>  
<b>Twoja rezerwacja:</b>
<br/>
<p>Termin przyjazdu: ${params.from.split('T')[0]}</p>
<br/>
<p>${params.firstName} ${params.lastName}</p>
<p>Email: ${params.email}</p>
<p>Nr tel: ${params.phone}</p>
<p>Liczba gości: ${params.guests}</p>
<p>Cena: ${params.price} zł</p>
<p>Unikalny numer id państwa rezerwacji to: ${params.reservationId}</p>
<br/>
<b>Całkowity koszt państwa rezerwacji to ${params.price} zł.</b>
<br/> 
<br/> 
<br/> 
<b>Potwierdzenie rezerwacji:</b>
<br/> 
<p>Proszę potwierdzić swoją rezerwację, dokonując płatności zadatku w wysokości <b>50% ceny całego pobytu</b>. Reszta opłaty będzie do uiszczenia gotówką w dniu przyjazdu (z góry).</p>
<br/> 
<p>Dane do przelewu:</p>
<br/>
    <p>nr konta: TU_NR_KONTA</p>
<br/>
<b>W tytule proszę wpisać: "rezerwacja domku"</b>
<br/>
<br/>
<p>Na wpłatę zadatku czekamy 72 godziny od złożenia zamówienia, jeżeli do tego czasu nie otrzymamy wpłaty rezerwacja zostaje anulowana.</p>
<br/>
<p>Brak wpłaty pozostałej kwoty skutkuje rezygnacją z zawartej umowy, a <b>wpłacony zadatek nie podlega zwrotowi.</b></p>
<br/>
<p>Terminem zapłaty należności jest jej uznanie na rachunku bankowym.</p>
<br/>
<br/> 
<br/> 
<p>Dziękuję i do zobaczenia!</p>
</body></html>
`;
