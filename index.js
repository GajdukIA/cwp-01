let name ="";
for(a =2;a<process.argv.length;a++){
    name=name+' '+process.argv[a];
}
console.log(name);