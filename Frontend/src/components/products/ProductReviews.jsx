
import { useEffect, useState } from "react";

import {
    Star,
    Trash2,
    Edit,
} from "lucide-react";

import {
    getProductReviews,
    addProductReview,
    updateProductReview,
    deleteProductReview,
} from "../../services/reviewService";


export default function ProductReviews({ productId }) {

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // Load reviews from backend
    const loadReviews = async () => {

        try {

            setLoading(true);

            const data = await getProductReviews(productId);

            setReviews(data.reviews || []);
            setAverageRating(data.average_rating || 0);
            setTotalReviews(data.total_reviews || 0);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadReviews();

    }, [productId]);


    // Submit a new review or update an existing review
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!localStorage.getItem("access")) {
            setError("Please login to write a review.");
            return;
        }

        if (!comment.trim()) {
            setError("Please write your review.");
            return;
        }

        try {

            setSaving(true);
            setError("");
            setMessage("");

            if (editingId) {

                await updateProductReview(editingId, {
                    rating,
                    comment,
                });

                setMessage("Review updated successfully.");

            } else {

                await addProductReview(productId, {
                    rating,
                    comment,
                });

                setMessage("Review submitted successfully.");

            }

            // Clear form
            setRating(5);
            setComment("");
            setEditingId(null);

            // Refresh review list
            await loadReviews();

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }
    };


    // Start editing a review
    const handleEdit = (review) => {

        setEditingId(review.id);
        setRating(review.rating);
        setComment(review.comment);

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };


    // Delete a review
    const handleDelete = async (reviewId) => {

        if (!window.confirm("Delete this review?")) {
            return;
        }

        try {

            await deleteProductReview(reviewId);

            setMessage("Review deleted successfully.");

            await loadReviews();

        } catch (err) {

            setError(err.message);

        }
    };


    return (

        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-[#102342]">
                Customer Reviews
            </h2>


            {/* Average rating */}
            <div className="mt-4 flex items-center gap-3">

                <span className="text-3xl font-bold text-amber-500">
                    {averageRating.toFixed(1)}
                </span>

                <div>

                    <div className="flex gap-1">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <Star
                                key={star}
                                size={18}
                                className={
                                    star <= Math.round(averageRating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                }
                            />

                        ))}

                    </div>

                    <p className="text-sm text-gray-500">
                        Based on {totalReviews} review(s)
                    </p>

                </div>

            </div>


            {/* Messages */}
            {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            {message && (
                <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {message}
                </p>
            )}


            {/* Review list */}
            <div className="mt-7 space-y-5">

                {loading ? (

                    <p className="text-gray-500">
                        Loading reviews...
                    </p>

                ) : reviews.length === 0 ? (

                    <p className="text-gray-500">
                        No reviews yet. Be the first to review this product.
                    </p>

                ) : (

                    reviews.map((review) => (

                        <article
                            key={review.id}
                            className="border-b border-gray-100 pb-5"
                        >

                            <div className="flex items-start justify-between gap-3">

                                <div>

                                    <h3 className="font-bold text-gray-800">
                                        {review.user_name}
                                    </h3>

                                    <div className="mt-1 flex gap-1">

                                        {[1, 2, 3, 4, 5].map((star) => (

                                            <Star
                                                key={star}
                                                size={15}
                                                className={
                                                    star <= review.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-300"
                                                }
                                            />

                                        ))}

                                    </div>

                                </div>

                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </span>

                            </div>


                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {review.comment}
                            </p>


                            {/* Only show controls to the review owner */}
                            {review.is_mine && (

                                <div className="mt-3 flex gap-4">

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(review)}
                                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit size={15} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(review.id)}
                                        className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={15} />
                                        Delete
                                    </button>

                                </div>

                            )}

                        </article>

                    ))

                )}

            </div>


            {/* Add or edit review form */}
            <form
                onSubmit={handleSubmit}
                className="mt-8 border-t border-gray-100 pt-6"
            >

                <h3 className="text-lg font-bold text-[#102342]">
                    {editingId ? "Edit Your Review" : "Write a Review"}
                </h3>


                {/* Star selection */}
                <div className="mt-4">

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Your Rating
                    </label>

                    <div className="flex gap-2">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >

                                <Star
                                    size={27}
                                    className={
                                        star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                    }
                                />

                            </button>

                        ))}

                    </div>

                </div>


                {/* Review text */}
                <div className="mt-5">

                    <label
                        htmlFor="review-comment"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                        Your Review
                    </label>

                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        placeholder="Share your experience with this product..."
                        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        required
                    />

                </div>


                <div className="mt-4 flex flex-wrap gap-3">

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update Review"
                                : "Submit Review"}
                    </button>


                    {editingId && (

                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setRating(5);
                                setComment("");
                            }}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

        </section>

    );

}
