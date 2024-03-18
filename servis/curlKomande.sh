port=12000
server="localhost"
echo "GET"
curl -X GET "http://$server:$port/baza/korisnici/"
echo ""
echo "POST"
curl -X POST http://$server:$port/baza/korisnici/ -H "Content-Type: application/json" -d "{\"korime\":\"mfranjic37\", \"email\":\"test3@foi.unizg.hr\", \"lozinka\":\"123456\", \"ime\":\"Test\", \"prezime\":\"Test\"}"
echo ""
echo "DELETE"
curl -X DELETE "http://$server:$port/baza/korisnici/"
echo ""
echo "PUT"
curl -X PUT "http://$server:$port/baza/korisnici/"
echo ""
echo "GET"
curl -X GET "http://$server:$port/baza/korisnici/pkos"
echo ""
echo "GET prijava tocna"
curl -X POST "http://$server:$port/baza/korisnici/pkos/prijava" -H 'Content-Type: application/json' -d '{"lozinka":"123456"}'
echo ""
echo "GET prijava kriva"
curl -X POST "http://$server:$port/baza/korisnici/pkos/prijava" -H 'Content-Type: application/json' -d '{"lozinka":"12345"}'
echo ""
echo "PUT"
curl -X PUT "http://$server:$port/baza/korisnici/pkos" -H 'Content-Type: application/json' -d '{"ime":"Test2", "prezime":"Test", "lozinka":"123456", "email":"test2@foi.unizg.hr"}'
echo ""
echo "DELETE"
curl -X DELETE "http://$server:$port/baza/korisnici/test"
echo ""
echo "POST"
curl -X POST "http://$server:$port/baza/korisnici/test"
echo ""

curl -X POST "http://localhost:12200/baza/korisnici/" -H 'Content-Type: application/json' -d '{"korime":"pkos", "email":"test3@foi.unizg.hr", "lozinka":"123456", "ime":"Test", "prezime":"Test"}'
curl -X POST "http://localhost:12200/baza/korisnici/" -H 'Content-Type: application/json' -d {"korime":"pkos", "email":"test3@foi.unizg.hr", "lozinka":"123456", "ime":"Test", "prezime":"Test"}
curl -X POST http://localhost:12200/baza/korisnici/ -H 'Content-Type: application/json' -d '{"korime":"pkos", "email":"test3@foi.unizg.hr", "lozinka":"123456", "ime":"Test", "prezime":"Test"}'