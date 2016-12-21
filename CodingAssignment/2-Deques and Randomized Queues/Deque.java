import java.util.NoSuchElementException;
import java.lang.UnsupportedOperationException;
import java.util.Iterator;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.Locale;

public class Deque<Item> implements Iterable<Item> {
	private Node first;
	private Node last;
	private int size;

	private class Node{
		Node next;
		Node previous;
		Item item;
	}

	public Deque()                           // construct an empty deque
	{
		first = null;
		last = null;
		size = 0;
	}
	public boolean isEmpty()                 // is the deque empty?
	{
		return size==0;
	}
	public int size()                        // return the number of items on the deque
	{
		return size;
	}
	public void addFirst(Item item)          // add the item to the front
	{
		if(item == null)throw new NoSuchElementException();
		Node oldfirst = first;
		first = new Node();
		first.item = item;
		first.next = oldfirst;
		first.previous = null;
		size++;
		if(oldfirst != null) oldfirst.previous = first;
		if(last == null) last = first;
	}
	public void addLast(Item item)           // add the item to the end
	{
		if(item == null)throw new NoSuchElementException();
		Node oldlast = last;
		last = new Node();
		last.item = item;
		last.next = null;
		last.previous = oldlast;
		size++;
		if(oldlast != null)oldlast.next = last;
		if(first == null) first = last;

	}
	public Item removeFirst()                // remove and return the item from the front
	{
		if(first != null && size>0){
			Item oldfirst = first.item;
			first = first.next;
			if(first != null)first.previous = null;
			size--;
			return oldfirst;
		}
		else{throw new UnsupportedOperationException();}

	}
	public Item removeLast()                 // remove and return the item from the end
	{
		if(last != null && size>0){
			Item oldlast = last.item;
			last =  last.previous;
			if(last != null) last.next = null;
			size--;
			return oldlast;
		}else{throw new UnsupportedOperationException();}

	}
	private class BidirectionalListIterator implements Iterator<Item>
	{
		private Node current = first;
		public boolean hasNext() { return current != null; }
		public void remove() { throw new UnsupportedOperationException(); }
		public Item next()
		{
			Item item = current.item;
			current = current.next;
			return item;
		}
	}

	public Iterator<Item> iterator()         // return an iterator over items in order from front to end
	{
		return new BidirectionalListIterator(); 
	}
	public static void main(String[] args)   // unit testing
	{
		Deque<String> deque1 = new Deque<String>();
		deque1.addFirst("A");
		deque1.addLast("B");
		deque1.addFirst("C");
		deque1.addLast("D");
		deque1.addFirst("E");
		deque1.addLast("F");
		while(!deque1.isEmpty()){
			System.out.printf(deque1.removeFirst());
			System.out.printf("\n");
		}
	}
}