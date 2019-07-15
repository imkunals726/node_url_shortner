const mongoose = require( 'mongoose' )
const SeqSchema = new mongoose.Schema({
	name :{
		type 		: String,
		required 	: true,
		unique 		: true
	},
	nextVal:{
		type 	: Number,
		default : 0
	}
})

const createSequnce = async(  seqName ) =>{
	const seq = new Sequence( { name : seqName } )
	await seq.save( )
	return seq
}

SeqSchema.statics.getNextVal = async ( seqName )=>{
	let seq 		= await Sequence.findOne( { name : seqName } ) 
	if( !seq ){
		seq = await createSequnce( seqName )
	}
	console.log( 'Sequence' + seq ) 
	const nextVal 	= seq.nextVal
	seq.nextVal 	= seq.nextVal + 1
	await seq.save( )
	return nextVal
}

const Sequence = mongoose.model( 'Sequence' , SeqSchema )

module.exports = Sequence